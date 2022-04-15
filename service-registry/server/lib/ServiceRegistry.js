import semver from 'semver';

class ServiceRegistry {
  constructor(log) {
    this.log = log;
    this.services = {};
    this.timeout = 30;
  }

  static key(name, version, ip, port) {
    return name + version + ip + port;
  }

  get(name, version) {
    const services = Object.values(this.services).filter(service => service.name === name && semver.satisfies(service.version, version));

    // simulate load balancing
    return services[Math.floor(Math.random() * services.length)];
  }

  register(name, version, ip, port) {
    const key = this.constructor.key(name, version, ip, port);

    if (!this.services[key]) {
      this.services[key] = {
        timestamp: Math.floor(new Date() / 1000),
        ip,
        port,
        name,
        version
      };
      this.log.debug(`Added a service with name ${name}, version ${version} at ${ip}:${port}`);
      return key;
    }

    this.services[key].timestamp = Math.floor(new Date() / 1000);
    this.log.debug(`Updated a service with name ${name}, version ${version} at ${ip}:${port}`);
    return key;
  }

  unregister(name, version, ip, port) {
    const key = this.constructor.key(name, version, ip, port);
    delete this.services[key];
    return key;
  }
}

export default ServiceRegistry;